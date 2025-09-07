import * as path from "path";
import Client from "ssh2-sftp-client";

const sftpConfig = {
  host: "95.216.200.243",
  port: 22, // стандартный порт SFTP
  username: "root",
  password: "mKHc33PsmknUVks4JJTC",
};

const sftp = new Client();

export async function sftpOperations() {
  try {
    // Подключение к серверу
    await sftp.connect(sftpConfig);
    console.log("Connected to SFTP server");
    const localFilePath = path.join(__dirname, "readme.txt");
    console.log("Local file path", localFilePath);
    const remoteFilePath = "/store/audio/readme.txt";
    console.log(Date.now());
    await sftp.put(localFilePath, remoteFilePath);
    console.log(Date.now());
    console.log(`File uploaded to ${remoteFilePath}`);

    // 4. Листинг файлов
    const fileList = await sftp.list("/store");
    console.log("Files in /remote:");
    fileList.forEach((file) => console.log(`- ${file.name} (${file.type})`));
  } catch (error) {
    console.error("SFTP error:", error);
  } finally {
    // Отключение (обязательно!)
    await sftp.end();
    console.log("Connection closed");
  }
}
