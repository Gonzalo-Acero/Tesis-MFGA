const selectAll = (selector) => Array.from(document.querySelectorAll(selector));

const resolveApiBaseUrl = () => {
  const candidate =
    window.__API_BASE_URL__ ||
    document.body?.getAttribute("data-api-base-url") ||
    "http://localhost:4000/api";

  return candidate.replace(/\/+$/, "");
};

document.addEventListener('DOMContentLoaded', () => {
  const requiresAuth = document.body?.dataset?.requiresAuth === 'true';
  const loginUrl =
    document.body?.getAttribute('data-login-url') || '/Login_Register/Login.html';
  const sessionStore = window.mfgaSession;
  const session = sessionStore?.load?.();

  if (requiresAuth && !session?.user) {
    window.location.href = loginUrl;
    return;
  }

  const fallbackUser = {
    UserId: null,
    Name: 'MFGA Explorer',
    Email: 'user@example.com',
    PhoneNumber: '',
  };

  const currentUser = { ...fallbackUser, ...(session?.user ?? {}) };
  const API_BASE_URL = resolveApiBaseUrl();
  const buildUrl = (path) =>
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const getAuthToken = () => sessionStore?.load?.()?.token ?? session?.token ?? null;
  const buildAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const profileButton = document.getElementById('profileButton');
  const profileDropdown = document.getElementById('profileDropdown');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  const editProfileModal = document.getElementById('editProfileModal');
  const changePasswordModal = document.getElementById('changePasswordModal');
  const profileForm = editProfileModal?.querySelector('[data-profile-form]');
  const profileFeedback = profileForm?.querySelector('[data-form-feedback]');
  const profileSubmitButton = profileForm?.querySelector('[data-profile-submit]');
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const phoneInput = document.getElementById('profile-phone');
  const passwordForm = changePasswordModal?.querySelector('[data-password-form]');
  const passwordFeedback = passwordForm?.querySelector('[data-password-feedback]');
  const passwordSubmitButton = passwordForm?.querySelector('[data-password-submit]');

  const logoutUrl =
    profileDropdown?.getAttribute('data-logout-url') ||
    loginUrl;

  window.mfgaCurrentUser = currentUser;

  const setTextContent = (nodes, value) => {
    nodes.forEach((node) => {
      node.textContent = value;
    });
  };

  const emitUserEvent = () => {
    window.dispatchEvent(
      new CustomEvent('mfga:user-loaded', {
        detail: { ...currentUser },
      })
    );
  };

  const updateUserInfoUi = () => {
    setTextContent(selectAll('[data-user-name]'), currentUser.Name ?? fallbackUser.Name);
    setTextContent(selectAll('[data-user-email]'), currentUser.Email ?? fallbackUser.Email);
    setTextContent(selectAll('[data-hero-name]'), (currentUser.Name || fallbackUser.Name).split(' ')[0]);

    selectAll('[data-user-avatar]').forEach((node) => {
      if (currentUser.AvatarUrl) {
        node.src = currentUser.AvatarUrl;
      }
    });
    emitUserEvent();
  };

  updateUserInfoUi();

  const persistUserChanges = (userPatch) => {
    Object.assign(currentUser, userPatch);
    if (session?.user) {
      sessionStore?.save?.({ ...session, user: { ...session.user, ...userPatch } });
    }
    updateUserInfoUi();
  };

  const toggleMobileNav = () => {
    if (!navLinks) return;
    navLinks.classList.toggle('hidden');
  };

  const closeMobileNav = () => {
    if (!navLinks) return;
    navLinks.classList.add('hidden');
  };

  mobileNavToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMobileNav();
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth < 768 && navLinks && !navLinks.classList.contains('hidden')) {
      if (!navLinks.contains(event.target) && event.target !== mobileNavToggle && !mobileNavToggle?.contains(event.target)) {
        closeMobileNav();
      }
    }
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeMobileNav();
      }
    });
  });

  const openDropdown = () => {
    if (!profileDropdown) return;
    profileDropdown.classList.remove('hidden');
    requestAnimationFrame(() => {
      profileDropdown.classList.remove('scale-95', 'opacity-0');
      profileDropdown.classList.add('scale-100', 'opacity-100');
    });
  };

  const closeDropdown = () => {
    if (!profileDropdown || profileDropdown.classList.contains('hidden')) return;
    profileDropdown.classList.remove('scale-100', 'opacity-100');
    profileDropdown.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      profileDropdown.classList.add('hidden');
    }, 200);
  };

  profileButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (profileDropdown?.classList.contains('hidden')) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  document.addEventListener('click', (event) => {
    if (
      profileDropdown &&
      !profileDropdown.contains(event.target) &&
      !profileButton?.contains(event.target)
    ) {
      closeDropdown();
    }
  });

  const animateModal = (modal, shouldShow) => {
    if (!modal) return;
    const panel = modal.querySelector('[data-modal-panel]');
    if (!panel) return;

    if (shouldShow) {
      modal.classList.remove('hidden');
      requestAnimationFrame(() => {
        panel.classList.remove('scale-95', 'opacity-0');
        panel.classList.add('scale-in');
      });
    } else {
      panel.classList.remove('scale-in');
      panel.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 200);
    }
  };

  const populateProfileForm = () => {
    if (!profileForm) return;
    if (nameInput) nameInput.value = currentUser.Name ?? '';
    if (emailInput) emailInput.value = currentUser.Email ?? '';
    if (phoneInput) phoneInput.value = currentUser.PhoneNumber ?? '';
    if (profileFeedback) {
      profileFeedback.textContent = '';
      profileFeedback.classList.add('hidden');
    }
  };

  const openProfileModal = (focusField) => {
    populateProfileForm();
    animateModal(editProfileModal, true);
    if (focusField === 'email') {
      setTimeout(() => emailInput?.focus(), 150);
    }
  };

  const openChangePasswordModal = () => {
    if (passwordFeedback) {
      passwordFeedback.textContent = '';
      passwordFeedback.classList.add('hidden');
    }
    passwordForm?.reset();
    animateModal(changePasswordModal, true);
  };

  const closeProfileModal = () => animateModal(editProfileModal, false);
  const closePasswordModal = () => animateModal(changePasswordModal, false);

  selectAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('#editProfileModal, #changePasswordModal');
      if (modal?.id === 'editProfileModal') {
        closeProfileModal();
      } else if (modal?.id === 'changePasswordModal') {
        closePasswordModal();
      }
    });
  });

  [editProfileModal, changePasswordModal].forEach((modal) => {
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) {
        if (modal.id === 'editProfileModal') {
          closeProfileModal();
        } else {
          closePasswordModal();
        }
      }
    });
  });

  profileDropdown
    ?.querySelectorAll('[data-profile-action]')
    .forEach((actionLink) => {
      actionLink.addEventListener('click', (event) => {
        event.preventDefault();
        const action = actionLink.getAttribute('data-profile-action');

        closeDropdown();

        switch (action) {
          case 'edit-profile':
            openProfileModal();
            break;
          case 'change-email':
            openProfileModal('email');
            break;
          case 'change-password':
            openChangePasswordModal();
            break;
          case 'logout':
            sessionStore?.clear?.();
            window.location.href = logoutUrl;
            break;
          default:
            console.info(`Action not implemented: ${action}`);
        }
      });
    });

  const setProfileFeedback = (message, variant = 'error') => {
    if (!profileFeedback) return;
    profileFeedback.textContent = message;
    profileFeedback.classList.remove('hidden');
    profileFeedback.classList.toggle('text-green-600', variant === 'success');
    profileFeedback.classList.toggle('text-red-600', variant !== 'success');
  };

  const setProfileLoading = (loading) => {
    if (!profileSubmitButton) return;
    profileSubmitButton.disabled = loading;
    profileSubmitButton.classList.toggle('opacity-70', loading);
    profileSubmitButton.textContent = loading ? 'Saving...' : 'Save changes';
  };

  profileForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!currentUser.UserId) {
      setProfileFeedback('You must sign in to update your profile');
      return;
    }

    const nameValue = nameInput?.value.trim();
    const emailValue = emailInput?.value.trim();
    const phoneValue = phoneInput?.value.trim();

    if (!nameValue || !emailValue) {
      setProfileFeedback('Name and email are required');
      return;
    }

    const emailValid = /\S+@\S+\.\S+/.test(emailValue);
    if (!emailValid) {
      setProfileFeedback('Enter a valid email');
      return;
    }

    const payload = {};
    if (nameValue !== currentUser.Name) payload.Name = nameValue;
    if (emailValue !== currentUser.Email) payload.Email = emailValue;
    if ((phoneValue || '') !== (currentUser.PhoneNumber || '')) {
      payload.PhoneNumber = phoneValue || null;
    }

    if (!Object.keys(payload).length) {
      setProfileFeedback('There are no changes to save', 'success');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch(buildUrl(`/users/${currentUser.UserId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload?.error || 'Could not update the profile');
      }

      const updatedUser = await response.json();
      persistUserChanges(updatedUser);
      setProfileFeedback('Profile updated successfully', 'success');
      setTimeout(() => {
        closeProfileModal();
      }, 800);
    } catch (error) {
      console.error(error);
      setProfileFeedback(error.message || 'An error occurred while updating the profile');
    } finally {
      setProfileLoading(false);
    }
  });

  const setPasswordFeedback = (message, variant = 'error') => {
    if (!passwordFeedback) return;
    passwordFeedback.textContent = message;
    passwordFeedback.classList.remove('hidden');
    passwordFeedback.classList.toggle('text-green-600', variant === 'success');
    passwordFeedback.classList.toggle('text-red-600', variant !== 'success');
  };

  const setPasswordLoading = (loading) => {
    if (!passwordSubmitButton) return;
    passwordSubmitButton.disabled = loading;
    passwordSubmitButton.classList.toggle('opacity-70', loading);
    passwordSubmitButton.textContent = loading ? 'Updating...' : 'Update';
  };

  passwordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!currentUser.UserId) {
      setPasswordFeedback('You must sign in to change your password');
      return;
    }

    const currentValue = passwordForm.currentPassword?.value.trim();
    const newValue = passwordForm.newPassword?.value.trim();
    const confirmValue = passwordForm.confirmPassword?.value.trim();

    if (!currentValue || !newValue || !confirmValue) {
      setPasswordFeedback('Fill in all fields');
      return;
    }

    if (newValue.length < 6) {
      setPasswordFeedback('Password must be at least 6 characters');
      return;
    }

    if (newValue !== confirmValue) {
      setPasswordFeedback('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(buildUrl('/auth/change-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders() },
        body: JSON.stringify({
          userId: currentUser.UserId,
          currentPassword: currentValue,
          newPassword: newValue,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || 'Could not update the password');
      }

      setPasswordFeedback('Password updated successfully', 'success');
      passwordForm.reset();
      setTimeout(() => {
        closePasswordModal();
      }, 900);
    } catch (error) {
      console.error(error);
      setPasswordFeedback(error.message || 'Error updating the password');
    } finally {
      setPasswordLoading(false);
    }
  });
});



