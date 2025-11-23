const fs = require("fs");
const path = require("path");
const busboy = require("busboy");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const bb = busboy({ headers: event.headers });
    const fields = {};
    const uploads = {};

    return await new Promise((resolve, reject) => {
      bb.on("field", (name, val) => {
        fields[name] = val;
      });

      bb.on("file", (name, file, info) => {
        const savePath = `/tmp/${info.filename}`;
        uploads[name] = savePath;

        const writeStream = fs.createWriteStream(savePath);
        file.pipe(writeStream);

        writeStream.on("close", () => {});
      });

      bb.on("close", async () => {
        const studioSlug = fields.creator.toLowerCase().replace(/ /g, "-");

        const studioPath = `data/studios/${studioSlug}.json`;

        let studioData = {
          studio: studioSlug,
          items: []
        };

        if (fs.existsSync(studioPath)) {
          studioData = JSON.parse(fs.readFileSync(studioPath));
        }

        const newItem = {
          id: "item-" + Date.now(),
          type: fields.contentType,
          title: fields.title,
          creator: fields.creator,
          producer: fields.producer,
          genre: fields.genre,
          price: fields.price,
          cover: "/uploads/" + path.basename(uploads.cover),
          file: "/uploads/" + path.basename(uploads.file),
          created_at: new Date().toISOString()
        };

        studioData.items.push(newItem);

        fs.writeFileSync(studioPath, JSON.stringify(studioData, null, 2));

        resolve({
          statusCode: 200,
          body: JSON.stringify({ success: true })
        });
      });

      bb.on("error", reject);

      bb.end(Buffer.from(event.body, "base64"));
    });

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Upload failed" })
    };
  }
};
