import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { message, Divider, Button, Modal, notification } from 'antd'
import { Get, PostMessage } from 'src/libs/api';
import { Configer } from 'src/libs/methods';

import qs from 'query-string';

const enhance = compose(
  connect(
    state => ({
      viewtypes: state.settings.viewtypes,
      tables: state.settings.tables,
      columntypes: state.settings.columntypes,
      filtertypes: state.settings.filtertypes
    })
  ),
  withState('ready', 'changeReady', false),
  withState('values', 'changeValues', {}),
  withState('renderJson', 'changeRenderJson', {}),
  withState('views', 'changeViews', []),
  withState('helper', 'changeHelper', {}),
  withHandlers({
    getData: ({ changeReady, changeValues, changeViews, location }) => () => {
      Get('/api/compo', { id: qs.parse(location.search).id }).then((res) => {
        document.title = res.data.outjson.title;

        changeValues(res.data.outjson);
        Get('/api/views', {}).then((res) => {
          changeViews(res.data.outjson);
          changeReady(true);
        });
      });
    },
    handlerSaveForm: ({ values }) => () => {
      /*
        save view
      */
      PostMessage({
        url: 'api/compo',
        data: JSON.stringify(values)
      }).then((res) => {
        notification['success']({
          message: 'Ok',
          description: ''
        });
      });

    }
  }),
  withHandlers({
    handlerValues: ({ changeValues }) => (values, element) => {
      changeValues(values);
    },
    handlerValuesHelper: ({ helper, changeHelper }) => (values, element, type) => {
      helper[type] = values;
      changeHelper(helper);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { renderJson, changeRenderJson, getData } = this.props;
      // block: basic settings
      let config_basic = [
        {
          block: 'row',
          params: {
            css: '',
            gutter: 4
          },
          content: [
            {
              block: 'col',
              params: {
                css: '',
                span: 12
              },
              content: [
                {
                  block: 'input',
                  binding: 'path',
                  type: 'text',
                  params: {
                    css: '',
                    label: 'compo path',
                    placeholder: 'path',
                  }
                },
              ]
            },
            {
              block: 'col',
              params: {
                css: '',
                span: 12
              },
              content: [
                {
                  block: 'input',
                  binding: 'title',
                  type: 'text',
                  params: {
                    css: '',
                    label: 'compo title',
                    placeholder: 'title ',
                  }
                }
              ]
            },
          ]
        },
      ];

      let config_views = [
        {
          block: 'row',
          params: {
            css: '',
            gutter: 4
          },
          content: [
            {
              block: 'col',
              params: {
                css: '',
                span: 24
              },
              content: [
                {
                  block: 'select',
                  binding: 'path',
                  params: {
                    css: '',
                    showSearch: true,
                    labelInValue: true,
                    data: 'views',
                    api_id: 'id',
                    api_text: 'title',
                    label: 'Выберите View',
                    placeholder: 'view path',
                    item_path: 'path'
                  }
                }
              ]
            },
            {
              block: 'col',
              params: {
                css: '',
                span: 8
              },
              content: [
                {
                  block: 'input',
                  binding: 'width',
                  type: 'number',
                  params: {
                    css: '',
                    label: 'width',
                    placeholder: 'width',
                    min: 0,
                    max: 24
                  }
                }
              ]
            },
          ]
        },
      ]

      renderJson.basic = Configer.parseJSON(config_basic);
      renderJson.views = Configer.parseJSON(config_views);
      changeRenderJson(renderJson);

      getData();
    }
  })
);

export default enhance;
