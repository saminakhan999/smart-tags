import React from 'react';
import get from 'lodash/get';
// import styled from 'styled-components';
import { Status } from '@strapi/design-system';
import pluginId from '../../pluginId';

// const StyledStatus = styled(Status)`
//   width: min-content;
//   margin: 2px;
// `;

const addColumnToTableHook = ({ displayedHeaders, layout }) => {
  const pluginOptions = get(layout, `contentType.pluginOptions.${pluginId}`);

  if (!pluginOptions) return { displayedHeaders, layout };

  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        key: '__taginput_key__',
        fieldSchema: { type: 'string' },
        metadatas: {
          label: 'Tags',
          searchable: true,
          sortable: true,
        },
        name: pluginOptions.fieldName,
        cellFormatter(cellData) {
          let inputTags = []
          try {
            inputTags = JSON.parse(cellData[pluginOptions.fieldName]) || [];
          } catch (e) {
            console.log(e);
          }
          const tags = inputTags.map(tag => ({
            name: tag.name,
            prop: pluginOptions.tags[tag.name] || {color: 'neutral' }
          }))

          return <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: '100%' }}>
            {tags.map(tag => 
              (<Status showBullet={false} variant={tag.prop.color} size="S">
                {/* <Typography fontWeight="bold" textColor={`${tag.prop.color}700`}> */}
                  {tag.name}
                {/* </Typography> */}
              </Status>))}
          </div>
        },
      },
    ],
    layout,
  };
};

export default addColumnToTableHook;