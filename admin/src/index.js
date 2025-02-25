import addColumnToTableHook from './hooks/contentManagerHooks/addColumnToTable';
import pluginId from "./pluginId";
import Initializer from './components/Initializer';

export default {
  register(app) {
    app.customFields.register({
      name: "smart-tags",
      plugin: pluginId,
      type: "text",
      intlLabel: {
        id: "smart-tags.tag.label",
        defaultMessage: "Tags",
      },
      intlDescription: {
        id: "smart-tags.tag.description",
        defaultMessage: "Add custom tags",
      },
      components: {
        Input: async () =>
          import(
            "./components/Input"
          ),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "smart-tags.tags.section.apiUrl",
              defaultMessage: "API Url",
            },
            items: [
              {
                intlLabel: {
                  id: "smart-tags.tags.section.apiUrl",
                  defaultMessage: "Rest API URL for suggestions",
                },
                name: "options.apiUrl",
                type: "text",
                value: "",
                options: [],
              },
            ],
          },
        ],
      },
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
    });
  },
  bootstrap(app) {
    app.registerHook(
      'Admin/CM/pages/ListView/inject-column-in-table',
      addColumnToTableHook,
    );
  },
};
