// contentFilter.js - filter for profanity, sexual/adult terms, and spam

const Filter = require('bad-words');
const filter = new Filter();

const sexualPatterns = [
  /\b(nude|naked|sex|porn|xxx|nsfw|masturbat)\b/i,
  /\b(breast|boob|penis|vagina|dick|pussy)\b/i
];

function containsSexual(text) {
  if (!text) return false;
  return sexualPatterns.some(rx => rx.test(text));
}

function isSpamLike(text) {
  if (!text) return false;
  const urls = (text.match(/https?:\/\//gi) || []).length;
  const repeated = /(.)\1{8,}/.test(text); // long repeated chars
  const allCaps =
    text.replace(/[^A-Za-z]/g, '').length > 0 && text === text.toUpperCase();
  return urls > 2 || repeated || allCaps;
}

module.exports = {
  sanitizeMessage(raw, options = { replaceWith: '[message blocked: policy]' }) {
    if (!raw) return '';
    const trimmed = raw.trim();

    // Profanity
    if (filter.isProfane(trimmed)) {
      return options.replaceWith;
    }

    // Sexual/adult
    if (containsSexual(trimmed)) {
      return options.replaceWith;
    }

    // Spam
    if (isSpamLike(trimmed)) {
      return options.replaceWith;
    }

    // Clean mild profanity
    const cleaned = filter.clean(trimmed);
    return cleaned;
  }
};
