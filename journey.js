(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const select = form.elements.classFormat;
  const requestedClass = new URLSearchParams(location.search).get('class');
  if ([...select.options].some(option => option.value === requestedClass)) select.value = requestedClass;
  const phone = form.elements.phone;
  const nameInput = form.elements.name;
  nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, '');
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Please enter your name.');
    phone.setCustomValidity(phone.value.trim() && (digits.length < 7 || digits.length > 15) ? 'Enter a phone number with 7–15 digits, or leave this optional field blank.' : '');
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    const question = form.elements.question.value.trim();
    const selected = select.options[select.selectedIndex].textContent;
    const message = [`Hello Yogadyah, I’m ${name}. I’d like to request a trial class.`, `Class: ${selected}.`,
      ...(phone.value.trim() ? [`Phone: ${phone.value.trim()}.`] : []),
      ...(question ? [`My question: ${question}`] : []),
      ...(form.elements.timing?.value ? [`Preferred timing: ${form.elements.timing.value}.`] : []),
      'Please confirm availability, the trial fee and class duration.'].join('\n');
    const destination = form.dataset.whatsappPhone || '919836521721';
    const url = `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
    const status = document.querySelector('#contact-status');
    status.replaceChildren();
    const text = document.createElement('p');
    text.textContent = 'Your request is ready. Review and send it in WhatsApp; this website has not sent or booked anything.';
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.className = 'text-link';
    fallback.textContent = 'Open your WhatsApp request';
    status.append(text, fallback);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
