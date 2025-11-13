const applyUserDataToHero = (user) => {
  if (!user) return;
  const heroName = document.querySelector('[data-hero-name]');
  if (heroName) {
    heroName.textContent = (user.Name || 'Traveler').split(' ')[0];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const sessionStore = window.mfgaSession;
  const session = sessionStore?.load?.();

  if (!session?.user && document.body?.dataset?.requiresAuth === 'true') {
    window.location.href = '../Login_Register/Login.html';
    return;
  }

  const initialUser = window.mfgaCurrentUser || session?.user;
  applyUserDataToHero(initialUser);

  window.addEventListener('mfga:user-loaded', (event) => {
    applyUserDataToHero(event.detail);
  });

  feather.replace();

  const exploreButtons = document.querySelectorAll('.explore-btn');
  exploreButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.querySelector('i')?.classList.add('animate-bounce');
    });
    button.addEventListener('mouseleave', () => {
      button.querySelector('i')?.classList.remove('animate-bounce');
    });
  });
});
