"use strict";

const Hapi = require("@hapi/hapi");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return "hello world";
    },
  });

  server.route({
    method: "GET",
    path: "/posts/",
    handler: () => {
      const data = fs.readdirSync("./posts", "utf8");
      return data.map((item) => {
        const base = item.split(".");
        base.pop();
        return base.join(" ");
      });
    },
  });

  server.route({
    method: "GET",
    path: "/posts/{name}",
    handler: (request) => {
      try {
        const data = fs.readFileSync(
          `./posts/${request.params.name}.md`,
          "utf8"
        );
        return data;
      } catch (err) {
        console.error(err);
        return "Something went wrong or the post does not exist";
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
