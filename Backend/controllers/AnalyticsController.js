import AnalyticsService from '../services/AnalyticsService.js';

export async function getOverview(req, res, next) {
  try {
    const data = await AnalyticsService.getOverview();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
