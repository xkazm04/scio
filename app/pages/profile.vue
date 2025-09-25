<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-4 py-5 sm:p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600">Manage your account information and preferences.</p>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Profile Picture Section -->
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center space-x-6">
            <div class="shrink-0">
              <img
                :src="formData.avatarUrl || defaultAvatar"
                :alt="formData.fullName || 'Profile'"
                class="h-20 w-20 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">Profile Picture</h3>
              <p class="text-sm text-gray-500">Update your profile picture via your Google account</p>
              <button
                type="button"
                class="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
                @click="refreshProfile"
              >
                Sync from Google
              </button>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                v-model="formData.fullName"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                :value="formData.email"
                type="email"
                disabled
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
              />
              <p class="mt-1 text-xs text-gray-500">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                v-model="formData.role"
                :disabled="!canChangeRole"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option v-if="isAdmin" value="admin">Admin</option>
              </select>
              <p v-if="!canChangeRole" class="mt-1 text-xs text-gray-500">
                Contact an administrator to change your role.
              </p>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          
          <div class="space-y-4">
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="4"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  v-model="formData.dateOfBirth"
                  type="date"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="timezone" class="block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  v-model="formData.timezone"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Role-specific Information -->
        <div v-if="formData.role === 'teacher'" class="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Teacher Information</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                id="department"
                v-model="formData.department"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Mathematics"
              />
            </div>

            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <input
                id="qualification"
                v-model="formData.qualification"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., M.Ed. Mathematics"
              />
            </div>

            <div class="sm:col-span-2">
              <label for="specialization" class="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <input
                id="specialization"
                v-model="formData.specialization"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Algebra, Geometry"
              />
            </div>
          </div>
        </div>

        <div v-if="formData.role === 'student'" class="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="grade" class="block text-sm font-medium text-gray-700">
                Grade/Year
              </label>
              <input
                id="grade"
                v-model="formData.grade"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Grade 10, Year 2"
              />
            </div>

            <div>
              <label for="studentId" class="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                id="studentId"
                v-model="formData.studentId"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter student ID"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 py-5 sm:p-6 border-t border-gray-200">
          <div class="flex justify-between">
            <button
              type="button"
              @click="resetForm"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
            >
              Reset Changes
            </button>
            
            <button
              type="submit"
              :disabled="isSaving"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSaving">Save Changes</span>
              <span v-else>Saving...</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="message" class="px-4 py-3 border-t border-gray-200">
        <div
          :class="[
            'p-3 rounded-md text-sm',
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          ]"
        >
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserWithProfile, Role } from '~/lib/database/types';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Form state
const formData = reactive({
  fullName: '',
  email: '',
  avatarUrl: '',
  role: 'student' as Role,
  phone: '',
  bio: '',
  dateOfBirth: '',
  timezone: 'UTC',
  // Teacher fields
  department: '',
  qualification: '',
  specialization: '',
  // Student fields
  grade: '',
  studentId: '',
});

const originalData = ref({});
const isSaving = ref(false);
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// Computed
const isAdmin = computed(() => formData.role === 'admin');
const canChangeRole = computed(() => isAdmin.value); // Only admins can change roles

// Default avatar
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSIyNCIgeT0iMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIj4KPHN0eWxlPgogICAgLmdyYXkgeyBmaWxsOiAjOTE5N0E0OyB9Cjwvc3R5bGU+CjxwYXRoIGQ9Ik0xNiAxNkMxOS4zMTM3IDE2IDIyIDEzLjMxMzcgMjIgMTBDMjIgNi42ODYyOSAxOS4zMTM3IDQgMTYgNEMxMi42ODYzIDQgMTAgNi42ODYyOSAxMCAxMEMxMCAxMy4zMTM3IDEyLjY4NjMgMTYgMTYgMTZaIiBjbGFzcz0iZ3JheSIvPgo8cGF0aCBkPSJNMTYgMjBDMjAuNDE4MiAyMCAyNCAyMy41ODE4IDI0IDI4SDI4QzI4IDIwLjI2ODAgMjEuNzMyMCAxNCAxNCAxNEgxMi4wMDA5OEM2LjI2ODk4IDE0IDAgMjAuMjY4NCAwIDI4SDRDMCAyMy41ODE4IDMuNTgxODIgMjAgOCAyMEgxNloiIGNsYXNzPSJncmF5Ii8+Cjwvc3ZnPgo8L3N2Zz4K';

// Initialize form data
onMounted(() => {
  if (user.value) {
    formData.fullName = user.value.user_metadata?.full_name || user.value.email?.split('@')[0] || '';
    formData.email = user.value.email || '';
    formData.avatarUrl = user.value.user_metadata?.avatar_url || '';
    
    // Store original data for reset
    originalData.value = { ...formData };
  }
});

// Methods
const saveProfile = async () => {
  try {
    isSaving.value = true;
    message.value = null;

    // Here you would save the profile to your database using the useDatabase composable
    // For now, we'll just simulate a successful save
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    message.value = {
      type: 'success',
      text: 'Profile updated successfully!'
    };

    // Update original data
    originalData.value = { ...formData };
  } catch (error) {
    console.error('Profile save error:', error);
    message.value = {
      type: 'error',
      text: 'Failed to update profile. Please try again.'
    };
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, originalData.value);
  message.value = null;
};

const refreshProfile = async () => {
  try {
    // Refresh user data from Supabase
    const { data: { user: refreshedUser } } = await supabase.auth.getUser();
    
    if (refreshedUser) {
      formData.fullName = refreshedUser.user_metadata?.full_name || formData.fullName;
      formData.avatarUrl = refreshedUser.user_metadata?.avatar_url || formData.avatarUrl;
      
      message.value = {
        type: 'success',
        text: 'Profile synced from Google account!'
      };
    }
  } catch (error) {
    console.error('Profile refresh error:', error);
    message.value = {
      type: 'error',
      text: 'Failed to sync profile. Please try again.'
    };
  }
};

// Clear messages after 5 seconds
watch(message, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      message.value = null;
    }, 5000);
  }
});

// SEO
useHead({
  title: 'Nastavení profilu - SCIO',
});

// Protect the route
definePageMeta({
  middleware: 'auth'
});
</script>

<style scoped>
/* Custom styles if needed - using proper Tailwind utilities in template */
</style>