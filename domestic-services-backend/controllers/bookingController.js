
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import PDFDocument from "pdfkit";

// GET /api/bookings (current user's bookings)
export const getMyBookings = async (req, res) => {
  try {
    const items = await Booking.find({ userId: req.user.id })
      .populate('serviceId', 'name price')
      .populate('workerId', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// (Optional) GET /api/bookings/all (admin)
export const getAllBookings = async (req, res) => {
  try {
    const items = await Booking.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all bookings" });
  }
};

// GET /api/bookings/worker (for workers to see all bookings)
export const getWorkerBookings = async (req, res) => {
  try {
    const items = await Booking.find({ status: { $in: ['pending', 'confirmed', 'in_progress', 'completed'] } })
      .populate('userId', 'name email')
      .populate('serviceId', 'name price')
      .populate('workerId', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching worker bookings" });
  }
};

// GET /api/bookings/worker/analytics (for workers to get analytics data)
export const getWorkerAnalytics = async (req, res) => {
  try {
    const workerId = req.user.id;

    // Get all bookings for this worker
    const bookings = await Booking.find({ workerId })
      .populate('serviceId', 'name category price')
      .populate('userId', 'name');

    // Calculate basic analytics
    const totalServices = bookings.length;
    const completedServices = bookings.filter(b => b.status === 'completed').length;
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Calculate completion rate and average earnings
    const completionRate = totalServices > 0 ? (completedServices / totalServices) * 100 : 0;
    const averageEarnings = completedServices > 0 ? totalEarnings / completedServices : 0;

    // Services by category with detailed breakdown
    const servicesByCategory = {};
    const categoryEarnings = {};
    bookings.forEach(b => {
      if (b.serviceId && b.serviceId.category) {
        const category = b.serviceId.category;
        servicesByCategory[category] = (servicesByCategory[category] || 0) + 1;
        if (b.status === 'completed') {
          categoryEarnings[category] = (categoryEarnings[category] || 0) + (b.amount || 0);
        }
      }
    });

    // Monthly earnings and services (last 12 months for better trends)
    const monthlyData = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { earnings: 0, services: 0, completed: 0 };
    }

    bookings.forEach(b => {
      if (b.status === 'completed' && b.completedAt) {
        const completedDate = new Date(b.completedAt);
        const monthKey = completedDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].earnings += b.amount || 0;
          monthlyData[monthKey].completed += 1;
        }
      }

      // Count all services by month (based on booking date)
      const bookingDate = new Date(b.date);
      const bookingMonthKey = bookingDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (monthlyData[bookingMonthKey]) {
        monthlyData[bookingMonthKey].services += 1;
      }
    });

    // Calculate weekly performance (last 12 weeks)
    const weeklyData = {};
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `Week of ${weekStart.toLocaleDateString()}`;
      weeklyData[weekKey] = { earnings: 0, services: 0 };
    }

    bookings.forEach(b => {
      if (b.status === 'completed' && b.completedAt) {
        const completedDate = new Date(b.completedAt);
        const weekStart = new Date(completedDate);
        weekStart.setDate(completedDate.getDate() - completedDate.getDay());
        const weekKey = `Week of ${weekStart.toLocaleDateString()}`;

        if (weeklyData[weekKey]) {
          weeklyData[weekKey].earnings += b.amount || 0;
          weeklyData[weekKey].services += 1;
        }
      }
    });

    // Customer satisfaction from actual ratings
    const ratedBookings = bookings.filter(b => b.rating !== null && b.rating > 0);
    const customerSatisfaction = ratedBookings.length > 0
      ? Math.round((ratedBookings.reduce((sum, b) => sum + b.rating, 0) / ratedBookings.length) * 20) // Convert 1-5 rating to 20-100 percentage
      : 0;

    // Top performing services
    const servicePerformance = {};
    bookings.forEach(b => {
      if (b.serviceId) {
        const serviceName = b.serviceId.name;
        if (!servicePerformance[serviceName]) {
          servicePerformance[serviceName] = { count: 0, earnings: 0, category: b.serviceId.category };
        }
        servicePerformance[serviceName].count += 1;
        if (b.status === 'completed') {
          servicePerformance[serviceName].earnings += b.amount || 0;
        }
      }
    });

    const topServices = Object.entries(servicePerformance)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const analytics = {
      // Basic metrics
      totalServices,
      completedServices,
      totalEarnings,
      completionRate,
      averageEarnings,
      customerSatisfaction,

      // Category breakdown
      servicesByCategory,
      categoryEarnings,

      // Time-based data
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        earnings: data.earnings,
        services: data.services,
        completed: data.completed
      })),
      weeklyData: Object.entries(weeklyData).map(([week, data]) => ({
        week,
        earnings: data.earnings,
        services: data.services
      })),

      // Performance insights
      topServices,

      // Additional metrics
      pendingServices: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      inProgressServices: bookings.filter(b => b.status === 'in_progress').length,
      cancelledServices: bookings.filter(b => b.status === 'cancelled').length
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching worker analytics" });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, location, mobile } = req.body;

    if (!serviceId || !date || !time || !location || !mobile) {
      return res.status(400).json({
        message: "serviceId, date, time, location, mobile are required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    // Get service details to store service name
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const bookingData = {
      userId: req.user.id,
      serviceId: serviceId,
      serviceName: service.name,
      date,
      time,
      location,
      mobile
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Error creating booking",
      error: error.message
    });
  }
};

// PATCH /api/bookings/:id (update booking status, for workers)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking is expired (24 hours time limit for pending bookings)
    if (booking.status === 'pending') {
      const bookingTime = new Date(booking.createdAt);
      const currentTime = new Date();
      const timeDiff = currentTime - bookingTime;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        return res.status(400).json({
          message: "Booking has expired. Cannot accept expired bookings.",
          expired: true
        });
      }
    }

    const updateData = { status };

    // Only allow workers to accept pending bookings
    if (status === 'confirmed' && booking.status === 'pending') {
      updateData.workerId = req.user.id;
      updateData.acceptedAt = new Date();
      console.log('Assigning worker to booking (confirmed):', req.user.id);
    }

    if (status === 'in_progress' && (booking.status === 'confirmed' || booking.status === 'pending')) {
      updateData.workerId = req.user.id;
      console.log('Assigning worker to booking (in_progress):', req.user.id, 'Current status:', booking.status);
    }

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    console.log('Update data:', updateData);
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('userId', 'name email')
      .populate('serviceId', 'name')
      .populate('workerId', 'name');

    console.log('Updated booking:', {
      id: updatedBooking._id,
      status: updatedBooking.status,
      workerId: updatedBooking.workerId,
      workerName: updatedBooking.workerId?.name
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: "Error updating booking" });
  }
};

// PATCH /api/bookings/:id/rating - update booking rating and review
export const updateBookingRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user owns this booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to rate this booking" });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: "Can only rate completed bookings" });
    }

    // Check if already rated
    if (booking.rating !== null && booking.rating > 0) {
      return res.status(400).json({ message: "Booking has already been rated" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const updateData = {
      rating: rating,
      review: review || '',
      ratedAt: new Date()
    };

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('serviceId', 'name');

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking rating:', error);
    res.status(500).json({ message: "Error updating booking rating" });
  }
};

// GET /api/bookings/:id/invoice - generate and send invoice PDF
export const generateInvoice = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email')
      .populate('serviceId', 'name price');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to access this invoice" });
    }

    // Create PDF document with custom settings
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${bookingId}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Helper function to draw line
    const drawLine = (y) => {
      doc.moveTo(50, y).lineTo(545, y).stroke();
    };

    // Header Section with gradient background and updated theme color
    const gradient = doc.linearGradient(50, 50, 545, 100);
    gradient.stop(0, '#1d4ed8').stop(1, '#3b82f6'); // Darker blue gradient
    doc.rect(50, 50, 495, 50).fill(gradient);
    doc.fillColor('#f3f4f6').fontSize(30).font('Courier-Bold').text('DOMESTIC SERVICES', 50, 60, { align: 'center' });
    doc.moveDown(2);

    // Invoice Title with new font and color
    doc.fillColor('#1e40af').fontSize(22).font('Courier-Bold').text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Invoice Details Box with shadow and updated theme color
    const invoiceBoxY = doc.y;
    doc.roundedRect(50, invoiceBoxY, 495, 90, 10).fill('#e0e7ff').stroke('#3b82f6');
    doc.fillColor('#1e40af').fontSize(14).font('Courier-Bold');
    doc.text('Invoice Number:', 60, invoiceBoxY + 15);
    doc.text('Invoice Date:', 320, invoiceBoxY + 15);
    doc.text('Booking Date:', 60, invoiceBoxY + 40);
    doc.text('Booking Time:', 320, invoiceBoxY + 40);
    doc.text('Payment Status:', 60, invoiceBoxY + 65);
    doc.text('Booking ID:', 320, invoiceBoxY + 65);

    doc.fillColor('#1e3a8a').fontSize(14).font('Courier');
    doc.text(bookingId.substring(0, 8).toUpperCase(), 160, invoiceBoxY + 15);
    // Format invoice date properly
    const invoiceDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A';
    doc.text(invoiceDate, 400, invoiceBoxY + 15);
    doc.text(new Date(booking.date).toLocaleDateString(), 160, invoiceBoxY + 40);
    doc.text(booking.time, 400, invoiceBoxY + 40);
    doc.text(booking.paymentStatus.toUpperCase(), 160, invoiceBoxY + 65);
    doc.text(bookingId.substring(0, 8).toUpperCase(), 400, invoiceBoxY + 65);

    doc.y = invoiceBoxY + 110; // Increased space between invoice details and bill to section

    // Customer Details Section with updated font and color
    doc.fillColor('#1e40af').fontSize(18).font('Courier-Bold').text('BILL TO:', 50, doc.y);
    doc.moveDown(0.5);
    doc.fillColor('#1e3a8a').fontSize(16).font('Courier-Bold').text(booking.userId.name);
    doc.moveDown(0.3);
    doc.fillColor('#2563eb').fontSize(14).font('Courier').text(booking.userId.email);
    doc.moveDown();

    // Service Details Table with updated font and color
    const tableY = doc.y;
    doc.fillColor('#1e40af').fontSize(18).font('Courier-Bold').text('SERVICE DETAILS', 50, tableY);
    doc.moveDown();

    // Table Header with updated theme color and font
    const headerY = doc.y;
    doc.roundedRect(50, headerY, 495, 30, 5).fill('#c7d2fe').stroke('#1e40af');
    doc.fillColor('#1e3a8a').fontSize(14).font('Courier-Bold');
    doc.text('Service', 60, headerY + 10);
    doc.text('Date & Time', 260, headerY + 10);
    doc.text('Location', 380, headerY + 10);
    doc.text('Amount', 480, headerY + 10, { width: 50, align: 'right' });

    // Table Row with updated font and color
    const rowY = headerY + 30;
    doc.roundedRect(50, rowY, 495, 30, 5).fill('#f3f4f6').stroke('#c7d2fe');
    doc.fillColor('#1e3a8a').fontSize(14).font('Courier');
    doc.text(booking.serviceId.name, 60, rowY + 10);
    doc.text(`${new Date(booking.date).toLocaleDateString()} at ${booking.time}`, 260, rowY + 10);
    doc.text(booking.location, 380, rowY + 10, { width: 120 });
    doc.text(`₹${booking.amount.toFixed(2)}`, 480, rowY + 10, { width: 50, align: 'right' });

    doc.y = rowY + 50;

    // Payment Summary with updated font and color
    const summaryY = doc.y;
    doc.fillColor('#1e40af').fontSize(18).font('Courier-Bold').text('PAYMENT SUMMARY', 50, summaryY);
    doc.moveDown();

    const summaryBoxY = doc.y;
    doc.roundedRect(350, summaryBoxY, 195, 70, 10).fill('#e0e7ff').stroke('#3b82f6');

    doc.fillColor('#1e3a8a').fontSize(14).font('Courier-Bold');
    doc.text('Subtotal:', 360, summaryBoxY + 15);
    doc.text('Tax (GST 18%):', 360, summaryBoxY + 35);
    doc.text('Total Amount:', 360, summaryBoxY + 55);

    const subtotal = booking.amount / 1.18;
    const tax = booking.amount - subtotal;

    doc.fillColor('#1e3a8a').fontSize(14).font('Courier');
    doc.text(`₹${subtotal.toFixed(2)}`, 480, summaryBoxY + 15, { width: 50, align: 'right' });
    doc.text(`₹${tax.toFixed(2)}`, 480, summaryBoxY + 35, { width: 50, align: 'right' });
    doc.text(`₹${booking.amount.toFixed(2)}`, 480, summaryBoxY + 55, { width: 50, align: 'right' });

    doc.y = summaryBoxY + 90;

    // Footer Section with updated font and color
    drawLine(doc.y);
    doc.moveDown();

    // Custom footer text with manual line breaks to keep it in one page and aligned
    const footerLines = [
      'Thank you for choosing Domestic Services!',
      'We appreciate your business and look forward to serving you again.',
      '',
      'This is a computer-generated invoice. No signature required.',
      `Generated on ${new Date().toLocaleString()}`
    ];

    const footerX = 50;
    let footerY = doc.y;
    const lineHeight = 12;
    doc.fillColor('#1e40af').fontSize(12).font('Courier');

    footerLines.forEach(line => {
      doc.text(line, footerX, footerY, { width: 495, align: 'center' });
      footerY += lineHeight;
    });

    // Finalize PDF
    doc.end();

  } catch (error) {
    res.status(500).json({ message: "Error generating invoice", error: error.message });
  }
};
