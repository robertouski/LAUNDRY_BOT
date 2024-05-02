const userQueues = {};

const MESSAGE_GAP_SECONDS = 5000;

/**
 * Adds a message to the specific user's queue for later processing.
 * @param phoneId The ID of the user sending the message.
 * @param messageText The text of the message to add to the queue.
 * @returns A promise that resolves when the user's message queue is processed.
 */
function enqueueMessage(phoneId, messageText) {
    if (!userQueues[phoneId]) {
        userQueues[phoneId] = { messages: [], timer: null };
    }

    userQueues[phoneId].messages.push({ text: messageText, timestamp: Date.now() });

    return new Promise((resolve) => {
        if (userQueues[phoneId].timer) {
            clearTimeout(userQueues[phoneId].timer);
        }

        userQueues[phoneId].timer = setTimeout(() => {
            resolve(processMessageQueue(phoneId));
            userQueues[phoneId].timer = null; // Clear the timer after processing
        }, MESSAGE_GAP_SECONDS);
    });
}

/**
 * Processes the message queue for a specific user by combining all messages into a single string and clearing the queue.
 * @param phoneId The ID of the user whose messages to process.
 * @returns The combined string of all messages in the user's queue.
 */
function processMessageQueue(phoneId) {
    if (userQueues[phoneId] && userQueues[phoneId].messages.length === 0) {
        return '';
    }

    const combinedMessage = userQueues[phoneId].messages.map(message => message.text).join(" ");
    userQueues[phoneId].messages.length = 0; // Clear the queue
    return combinedMessage;
}

module.exports = { enqueueMessage, processMessageQueue };
