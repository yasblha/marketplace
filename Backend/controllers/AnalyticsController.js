const AnalyticsService = require('../services/AnalyticsService');

exports.getOverview = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getOverview();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
