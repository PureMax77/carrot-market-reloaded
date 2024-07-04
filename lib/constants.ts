export const PASSWORD_MIN_LENGTH = 4;

// 소문자, 대문자, 숫자, 해당특수문자 포함 정규식
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

export const PASSWORD_REGEX_ERROR =
  "A password must have lowercase, UPPERCASE, a number and special characters.";
