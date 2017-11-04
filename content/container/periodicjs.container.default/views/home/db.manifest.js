'use strict';
const periodic = require('periodicjs');
const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');

const asyncdataprops = 'databasedata';
module.exports = {
  containers: {
    '/coredata/:db/:coredata': {
      layout: {
        component: 'Container',
        props: {
          style: {
            padding:'1rem',
          },
        },
        children: [
          reactappLocals.server_manifest.helpers.getPageTitle({
            asynctitle:['modeldata', 'data', 'description',],
            // title: 'RoboLoki > ',
            action: [
              {
                type: 'modal',
                pathname: '/add-coredata/:database_name/:model_name/:id',
                onclickProps: {
                  
                  params: [
                    {
                      key: ':database_name',
                      val:'database_name',
                    },
                    {
                      key: ':model_name',
                      val:'name',
                    },
                    {
                      key: ':id',
                      val:'_id',
                    },
                  ],
                },
                buttonProps: {
                  color:'isBlack',
                },
                title: 'New Document',
                responsiveButton: {
                  asyncprops: {
                    onclickPropObject:['modeldata', 'data', ],
                  },
                },
              },
              {
                type: 'link',
                link: '/',
                buttonProps: {
                  style: {
                    marginLeft:'1rem',
                  },
                  color:'isBlack',
                },
                title:'All Databases',
              },
            ],
          }),
          {
            component: 'ResponsiveTable',
            props: {
              style: {
                wordWrap: 'break-word',
              },
              tableWrappingStyle: {
                overflow:'initial',
              },
              'filterSearch': true,
              'tableSearch': true,
              flattenRowData: false,
              flattenRowDataOptions: { maxDepth: 3, },
              headers: [
                {
                  sortid: '_id',
                  label: 'Doc',
                },
              ],
              baseUrl: '/loki-db-load?format=json&genericdoc=true',
              dataMap: [
                {
                  key: 'rows',
                  value: 'docs',
                },
                {
                  key: 'numItems',
                  value: 'docscount',
                },
                {
                  key: 'numPages',
                  value: 'docspages',
                },
              ],
              customLayoutStyle: {
                flexDirection: 'column',    
                padding: '0rem 0rem 1rem',
              },
              customLayout: {
                component: 'ResponsiveCard',
                bindprops: true,
                thisprops: {
                  cardTitle: ['_id', ],
                },
                props: {
                  display: false,
                  cardStyle: {
                    marginBottom:0,
                  },
                  cardContentProps: {
                    style: {
                      padding: 0,
                      borderTop: '1px solid #d3d6db',
                      position:'relative',
                    },
                  },
                },
                children: [
                  {
                    component: 'CodeMirror',
                    bindprops: true,
                    props: {
                      stringify: true,
                      codeMirrorPropsOptions: {
                        readOnly:true,
                      },
                    },
                    thisprops: {
                      value:['row', ],
                    },
                    // children:'full doc'
                  },
                  {
                    component: 'div',
                    bindprops: true,                    
                    props: {
                      style: {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: '1rem',
                        zIndex:100,
                      },
                    },
                    children: [
                      reactappLocals.server_manifest.helpers.getButton({
                        action: {
                          type: 'modal',
                          pathname: '/edit-coredata/:database_name/:model_name/:id',
                          
                          modalTitle: 'Edit Document',
                          responsiveButton: {
                            asyncprops: {
                              onclickPropObject:['modeldata', 'data', ],
                            },
                          },
                        },
                        responsiveButton: {
                          bindprops:true,
                        },
                        button: {
                          color:'isInfo',
                        },
                        props: {
                          style: {
                            marginRight:'1rem',
                          },
                          onclickProps: {
                            title:'Edit Document',
                            pathname: '/edit-coredata/:entitytype/:id',
                            params: [
                              {
                                key: ':entitytype',
                                val:'entitytype',
                              },
                              {
                                key: ':id',
                                val:'_id',
                              },
                            ],
                          },
                        },
                        content:'Edit',
                      }),
                      reactappLocals.server_manifest.helpers.getButton({
                        action: {
                          type: 'fetch',
                          method: 'DELETE',
                          confirm: true,
                          refresh: true,
                          pathname: '/remove-db-doc/:entitytype/:id',
                          pathParams: [
                            {
                              key: ':id',
                              val:'_id',
                            },
                            {
                              key: ':entitytype',
                              val:'entitytype',
                            },
                          ],
                        },
                        responsiveButton: {
                          bindprops:true,
                        },
                        content:'Remove',
                      }),
                    ],

                  },
                ],
              },
            },
            asyncprops: {
              'rows': [
                asyncdataprops, 'data', 'docs',
              ],
              'numItems': [
                asyncdataprops, 'data', 'docscount',
              ],
              'numPages': [
                asyncdataprops, 'data', 'docspages',
              ],
            },
          },
        ],
      },
      resources: {
        databasedata:'/contentdata/:coredata?format=json&genericdoc=true',
        lokidb: '/roboloki/lokis/:db?format=json',
        modeldata:'/contentdata/dynamicdb_coredatamodels/:db?format=json',
      },
      pageData: {
        title:'RoboLoki > Database',
      },
    },
    '/edit-coredata/:entitytype/:id': {
      layout: {
        component: 'div',
        children:[
         
          reactappLocals.server_manifest.forms.createForm({
            method: 'PUT',
            action: '/update-coredata?handleupload=true&format=json&forcequerytobody=true',
            onSubmit:'closeModal',
            onComplete: 'refresh',
            loadingScreen: true,
            style: {
              paddingTop:'1rem',
            },
            hiddenFields: [
              {
                form_name: 'docid',
                form_val:'data._id',
              },
            ],
            rows: [
              {
                formElements: [
                  {
                    type: 'code',
                    name: 'data',
                    stringify:true,
                    label:'Edit Document',
                    passProps: {
                      // multiple:true,
                    },
                  },
                ],
              },
              {
                formElements: [
                  {
                    type: 'submit',
                    value: 'Update Document',
                    layoutProps: {
                      style: {
                        textAlign: 'center',
                      },
                    },
                  },
                ],
              },
            ],
            // actionParams
            // hiddenFields
            asyncprops: {
              formdata:['lokidoc', ],
            },
          }),
        ],
      },
      resources: {
        lokidoc:'/load-loki-doc/:entitytype/:id?format=json',
      },
      pageData: {
        title:'RoboLoki > Edit Document',
      },
    },
    '/add-coredata/:database_name/:model_name/:id': {
      layout: {
        component: 'div',
        children:[
          reactappLocals.server_manifest.forms.createForm({
            method: 'POST',
            action: '/add-coredata?handleupload=true&format=json&forcequerytobody=true',
            onSubmit:'closeModal',
            onComplete: 'refresh',
            loadingScreen: true,
            style: {
              paddingTop:'1rem',
            },
            hiddenFields: [
            ],
            rows: [
              {
                formElements: [
                  {
                    type: 'code',
                    name: 'newdoc',
                    value: `{}
`,
                    label:'New Document',
                    passProps: {
                      // multiple:true,
                    },
                  },
                ],
              },
              {
                formElements: [
                  {
                    type: 'submit',
                    value: 'Insert Document',
                    layoutProps: {
                      style: {
                        textAlign: 'center',
                      },
                    },
                  },
                ],
              },
            ],
            // actionParams
            // hiddenFields
            asyncprops: {},
          }),
        ],
      },
      resources: {},
      pageData: {
        title:'RoboLoki > New Document',
      },
    },
  },
};