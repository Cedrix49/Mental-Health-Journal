import journalModel from "../models/JournalEntry.js"; 

export const createEntry = async (req, res) => {
  try {
    const { mood, content } = req.body;
    const userId = req.userId;

    if (!content || content.length < 10) {
      return res.status(400).json({ success: false, message: 'Content too short.' });
    }

    const newEntry = journalModel.create({
      user: userId,
      mood,
      content,
    });

    res.status(201).json({ success: true, entry: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getLastEntry = async (req, res) => {
    try {
      const userId = req.userId;
  
      const lastEntry = await journalModel
        .findOne({ user: userId })
        .sort({ createdAt: -1 });
  
      if (!lastEntry) {
        return res.status(200).json({
          success: true,
          hasEntry: false,
        });
      }
  
      res.status(200).json({
        success: true,
        hasEntry: true,
        lastMood: lastEntry.mood,
        lastEntryDate: lastEntry.createdAt,
      });
      
    } catch (error) {
      console.error("Error fetching last entry:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};
  

export const getAllEntries = async (req, res) => {
    try {
      const { page = 1, limit = 5 } = req.query; // default to page 1, 5 per page
      const userId = req.userId;
  
      const entries = await journalModel
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const totalEntries = await journalModel.countDocuments({ user: userId });
  
      res.json({
        success: true,
        entries,
        totalPages: Math.ceil(totalEntries / limit),
        currentPage: Number(page),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
};
  

export const deleteEntry = async (req, res) => {
    try {
      const entry = await journalModel.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
      });
  
      if (!entry) {
        return res.status(404).json({ success: false, message: 'Entry not found.' });
      }
  
      res.status(200).json({ success: true, message: 'Entry deleted successfully.' });
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
};
  
export const updateEntry = async (req, res) => {
    try {
      const { content } = req.body;
  
      if (!content || content.length < 10) {
        return res.status(400).json({ success: false, message: 'Content too short.' });
      }
  
      const entry = await journalModel.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { content },
        { new: true }
      );
  
      if (!entry) {
        return res.status(404).json({ success: false, message: 'Entry not found.' });
      }
  
      res.status(200).json({ success: true, message: 'Entry updated successfully.', entry });
    } catch (error) {
      console.error('Error updating entry:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
};
  