"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "smart-tags",
    plugin: "smart-tags",
    type: "string",
    // type: "json",
  });
};
