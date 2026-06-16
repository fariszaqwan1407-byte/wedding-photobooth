const FOLDER_NAME = "Wedding Photobooth";

function getFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function doPost(e) {
  try {
    const folder = getFolder();

    const data = JSON.parse(e.postData.contents || "{}");
    const imageData = data.image;

    if (!imageData) {
      throw new Error("No image data received");
    }

    const blob = Utilities.newBlob(
      Utilities.base64Decode(imageData),
      "image/jpeg",
      "photo.jpg"
    );

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const imageUrl = file.getUrl();

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        url: imageUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "API alive"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}