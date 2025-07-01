import * as SettingsService from '../services/SettingsService.js';

export async function getSettings(req, res) {
  try {
    const settings = await SettingsService.getAll();
    res.json(settings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function updateSettings(req, res) {
  try {
    await SettingsService.updateAll(req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
} 