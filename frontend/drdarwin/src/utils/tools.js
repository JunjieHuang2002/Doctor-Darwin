export function ID_generator() {
    const now = new Date();
    const formattedDateTime = 
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    
    const dateTimeNumber = Number(formattedDateTime);
    const datePart = dateTimeNumber / 1000000;
    const randomAddend = Math.random() * 100000000;

    return Math.floor(datePart + randomAddend);
};

export function parseContent(content) {
    const thinkingText = content.split("<think>")[1]?.split("</think>")[0];
    if (thinkingText) {
        return {
            thinkingText: thinkingText,
            displayText: content.split("</think>")[1] || ""
        }
    } else {
        return {
            thinkingText: "",
            displayText: content
        }
    }
};
