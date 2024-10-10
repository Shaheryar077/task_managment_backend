// utils/responseHandler.js
class ResponseHandler {
    static success(res, data, message = 'Request successful') {
        return res.status(200).json({ success: true, data, message });
    }

    static created(res, data, message = 'Resource created successfully') {
        return res.status(201).json({ success: true, data, message });
    }

    static badRequest(res, message = 'Bad request') {
        return res.status(400).json({ success: false, message });
    }

    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({ success: false, message });
    }

    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({ success: false, message });
    }

    static conflict(res, message = 'Conflict') {
        return res.status(409).json({ success: false, message });
    }

    static error(res, message = 'Internal server error') {
        return res.status(500).json({ success: false, message });
    }
}

module.exports = ResponseHandler;