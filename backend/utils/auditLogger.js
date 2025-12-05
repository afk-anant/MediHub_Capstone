const AuditLog = require("../models/auditLog");

const logAction = async (userId, action, details) => {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};

module.exports = logAction;
