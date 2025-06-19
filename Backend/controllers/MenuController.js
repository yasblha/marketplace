import SectionService from '../services/MenuService.js';

async function getSections(req, res) {
    try {
        const sections = await SectionService.getSections();
        res.json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function createSection(req, res) {
    try {
        const newSection = await SectionService.createSection(req.body);
        res.json(newSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function updateSection(req, res) {
    try {
        const updatedSection = await SectionService.updateSection(req.params.id, req.body);
        res.json(updatedSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function deleteSection(req, res) {
    try {
        const success = await SectionService.deleteSection(req.params.id);
        res.json({ success: !!success });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { 
  getSections,
  createSection,
  updateSection,
  deleteSection
};
