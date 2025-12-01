// Validar fortaleza de contraseña
const checkPasswordStrength = (password) => {
  if (!password) return 'vacía';
  
  // Reglas de validación
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Calcular puntaje
  let score = 0;
  if (password.length >= minLength) score++;
  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChars) score++;
  
  // Determinar nivel
  if (password.length < 6) {
    return 'débil';
  } else if (score <= 2) {
    return 'débil';
  } else if (score === 3 || score === 4) {
    return 'intermedio';
  } else if (score >= 5) {
    return 'fuerte';
  }
  
  return 'débil';
};

// Validar requisitos de contraseña
const validatePasswordRequirements = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { checkPasswordStrength, validatePasswordRequirements };