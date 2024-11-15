<template>
  <section class="account-settings-section">
    <div class="account-settings-container">
      <h2>Account Settings</h2>
      <p>Manage your personal account settings here, update profile information, and set preferences.</p>
      <div class="settings-options">
        <div class="setting-item">
          <h3>Profile Information</h3>
          <p>Update your name, email address, and other personal information.</p>
          <button class="update-button">Update Profile</button>
        </div>
        <div class="setting-item">
          <h3>Security Settings</h3>
          <p>Change your password and manage two-factor authentication.</p>
          <button class="update-button">Manage Security</button>
        </div>
        <div class="setting-item">
          <h3>Preferences</h3>
          <p>Set your notification preferences and account visibility settings.</p>
          <button class="update-button">Update Preferences</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AccountSettingsSection',
};
</script>

<style scoped>
.account-settings-section {
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 15px;
  font-family: 'Arial, sans-serif';
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.account-settings-container {
  max-width: 800px;
  width: 100%;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.account-settings-container h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.account-settings-container p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 30px;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-item h3 {
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 10px;
}

.setting-item p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
}

.update-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.update-button:hover {
  background-color: #0056b3;
}
</style>
