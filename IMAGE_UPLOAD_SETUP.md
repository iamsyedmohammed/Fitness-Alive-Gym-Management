# Image Upload Setup Guide

## Overview
The admin panel now supports image uploads for both Members and Trainers. You can upload images directly from your computer instead of using URLs.

## Features
- ✅ Direct image file upload (JPEG, PNG, GIF, WebP)
- ✅ Image preview before upload
- ✅ File size validation (max 5MB)
- ✅ File type validation
- ✅ Remove image option
- ✅ Fallback to URL input (for trainers)
- ✅ Automatic image URL storage in database

## Directory Structure
```
gym-management/
├── public/
│   └── uploads/
│       ├── member/
│       │   └── (uploaded member images)
│       └── trainer/
│           └── (uploaded trainer images)
└── api/
    └── uploadImage.php
```

## Setup Instructions

### 1. Create Upload Directories
The directories will be created automatically when you upload the first image. However, for Hostinger, you may need to create them manually:

```bash
# In your Hostinger file manager or via FTP:
public_html/uploads/member/
public_html/uploads/trainer/
```

### 2. Set Directory Permissions
Make sure the uploads directory has write permissions (755 or 777):

```bash
chmod 755 public/uploads
chmod 755 public/uploads/member
chmod 755 public/uploads/trainer
```

### 3. Database Update
The `gym_members` table now includes an `image_url` column. If you have an existing database, the migration will run automatically on the next API call.

## How to Use

### For Members:
1. Open the "Add Member" or "Edit Member" form
2. Scroll to "Profile Image" section
3. Click "Choose Image" button
4. Select an image file from your computer
5. Preview will appear automatically
6. Click "Add Member" or "Update Member" to save
7. Image will be uploaded automatically

### For Trainers:
1. Open the "Add Trainer" or "Edit Trainer" form
2. Scroll to "Profile Image" section
3. Either:
   - Click "Choose Image" to upload a file, OR
   - Enter an image URL manually in the URL field below
4. If uploading, preview will appear
5. Click "Add Trainer" or "Update Trainer" to save

## API Endpoint

**POST** `/api/uploadImage.php`

**Parameters:**
- `image` (file): The image file to upload
- `type` (string): Either "member" or "trainer"

**Response:**
```json
{
  "success": true,
  "url": "/uploads/member/member_1234567890.jpg",
  "filename": "member_1234567890.jpg"
}
```

## Troubleshooting

### Issue: "Failed to save uploaded file"
**Solution:** Check directory permissions. The uploads directory must be writable.

### Issue: "Failed to create upload directory"
**Solution:** Manually create the directories and set proper permissions (755).

### Issue: Images not displaying
**Solution:** 
- Check if the image URL is correct
- Verify the uploads directory is accessible via web
- Check .htaccess file in uploads directory

### Issue: Upload works but image URL is wrong
**Solution:** Adjust the path in `uploadImage.php` based on your server structure. For Hostinger, images should be in `public_html/uploads/`.

## Security Notes
- Only image files are allowed (JPEG, PNG, GIF, WebP)
- Maximum file size: 5MB
- PHP files are blocked from execution in uploads directory
- File names are automatically generated to prevent conflicts

