const config = (plop) => {
  plop.setGenerator('component', {
    description: 'Generate react component',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'type component name',
      },
      {
        type: 'input',
        name: 'moduleName',
        message: 'type module name',
      },
    ],
    actions: [
      {
        type: 'add',
        path:
          'src/{{camelCase moduleName}}/components/{{camelCase componentName}}/{{properCase componentName}}.jsx',
        templateFile: 'plopTemplates/componentTemplate.hbs',
        // additional data for template
        data: {},
      },
    ],
  });
  plop.setGenerator('page', {
    description: 'Generate react page component',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'type component name',
      },
      {
        type: 'input',
        name: 'moduleName',
        message: 'type module name',
      },
    ],
    actions: [
      {
        type: 'add',
        path:
          'src/{{camelCase moduleName}}/pages/{{camelCase componentName}}/{{properCase componentName}}.jsx',
        templateFile: 'plopTemplates/componentTemplate.hbs',
        // additional data for template
        data: {},
      },
    ],
  });
  plop.setGenerator('state', {
    description: 'Generate state file',
    prompts: [
      {
        type: 'input',
        name: 'fileName',
        message: 'type component name',
      },
      {
        type: 'input',
        name: 'moduleName',
        message: 'type module name',
      },
    ],
    actions: [
      {
        type: 'add',
        path:
            'src/{{camelCase moduleName}}/state/{{camelCase fileName}}/{{properCase fileName}}.js',
        templateFile: 'plopTemplates/stateTemplate.hbs',
        // additional data for template
        data: {},
      },
    ],
  });
};

module.exports = config;
