# Telegram Groups - Quick Reference

## Access the Feature
1. Login to admin panel
2. Click "Telegram Grupları" in the sidebar
3. URL: `/telegram-groups`

## Add a New Telegram Group

1. Click "Yeni Telegram Grubu" button (top right)
2. Fill in the required fields:
   - **Grup Adı**: Name of the Telegram group (required, must be unique)
   - **Grup Linki**: Full Telegram link (required, e.g., https://t.me/eksicode)
   - **Üye Sayısı**: Number of members (required, number)
3. Optional fields:
   - **Kanal ID**: Telegram channel ID (e.g., -1001234567890)
   - **Sıra**: Display order (number)
   - **İkon**: Emoji or icon URL
   - **Açıklama**: Group description
   - **Aktif**: Check to make the group active
4. Click "Ekle" to save

## Edit a Telegram Group

1. Find the group in the table
2. Click the edit icon (pencil) in the Actions column
3. Modify the fields
4. Click "Güncelle" to save

## Delete a Telegram Group

1. Find the group in the table
2. Click the delete icon (trash) in the Actions column
3. Confirm deletion in the modal
4. Click "Sil" to confirm

## Search and Navigate

- Use pagination at the bottom to browse pages
- 10 items displayed per page
- Total items shown in pagination info

## Field Details

### Required Fields
- **Grup Adı** (name): Unique identifier for the group
- **Grup Linki** (link): Must be a valid URL
- **Üye Sayısı** (members): Integer, can be 0

### Optional Fields
- **Kanal ID** (channelId): Must be unique if provided
- **Sıra** (listOrder): Controls display order (ascending)
- **İkon** (icon): Can be emoji (📱) or image URL
- **Açıklama** (description): Free text field
- **Aktif** (active): Boolean, true by default

## Tips

1. **Use listOrder for organization**: Set listOrder values (1, 2, 3, etc.) to control the display order on the frontend
2. **Channel ID format**: Telegram channel IDs typically start with "-100" followed by numbers
3. **Link format**: Always use full URLs including https://
4. **Icon options**: 
   - Emoji: Copy-paste any emoji (📱, 💻, 🚀, etc.)
   - URL: Provide a link to an image file
5. **Deactivate vs Delete**: 
   - Uncheck "Aktif" to temporarily hide a group
   - Delete permanently removes the group

## Troubleshooting

### "Telegram grupları yüklenirken hata oluştu"
- Check if backend is running
- Verify API_URL in environment variables
- Check browser console for detailed errors

### "Ekleme başarısız" or "Güncelleme başarısız"
- Ensure all required fields are filled
- Check if group name is unique
- Check if channel ID is unique (if provided)
- Verify you're logged in (token valid)

### "Silme başarısız"
- Verify you're logged in
- Check if the group exists
- Check browser console for errors

## API Endpoints Used

- `GET /telegrams` - List all groups
- `GET /telegrams/:id` - Get single group
- `POST /telegrams` - Create group (auth required)
- `PUT /telegrams/:id` - Update group (auth required)
- `DELETE /telegrams/:id` - Delete group (auth required)

## Keyboard Shortcuts

- **Esc**: Close any open modal
- **Enter**: Submit form (when in input field)

## Best Practices

1. Keep group names clear and descriptive
2. Update member counts periodically
3. Use consistent icon style across all groups
4. Order groups logically (e.g., general groups first, specialized groups later)
5. Write meaningful descriptions to help users choose the right group
6. Deactivate instead of deleting groups that might be needed later
