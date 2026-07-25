const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I ambiguity

function randomCode(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/** Generates a short, human-friendly code, e.g. "SVR-7X4K2Q". */
export function generateCode(prefix: string): string {
  return `${prefix}-${randomCode()}`;
}
