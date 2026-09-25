import AssistantService from '../services/assistantService.js';

export async function handleAssistantMessage(req, res, next) {
  try {
    const { message, language = 'hi', conversationHistory = [] } = req.body;
    const userId = req.user?.id || null;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const result = await AssistantService.handleUserMessage({
      message: message.trim(),
      userId,
      language,
      conversationHistory
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export default { handleAssistantMessage };
