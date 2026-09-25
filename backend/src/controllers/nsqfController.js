import NSQFService from '../services/nsqfService.js';

export async function getQualifications(req, res, next) {
  try {
    const { sector, nsqfLevel, search } = req.query;
    const result = await NSQFService.getQualifications({ sector, nsqfLevel, search });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getQualificationById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await NSQFService.getQualificationByCode(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export default { getQualifications, getQualificationById };
