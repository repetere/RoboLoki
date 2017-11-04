'use strict';
const periodic = require('periodicjs');
// let reactapp = periodic.locals.extensions.get('periodicjs.ext.reactapp').reactapp();
const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');

const addDBForm = reactappLocals.server_manifest.forms.createForm({
  method: 'POST',
  action: '/roboloki/lokis?handleupload=true&format=json&forcequerytobody=true',
  onSubmit:'closeModal',
  onComplete: 'refresh',
  loadingScreen: true,
  style: {
    paddingTop:'1rem',
  },
  hiddenFields: [
  ],
  rows: [
    // {
    //   formElements: [
    //     {
    //       type: 'text',
    //       placeholder:'My Loki DB',
    //       label:'Name',
    //       name:'name',
    //     },
    //     {
    //       type: 'text',
    //       placeholder:'Database description',
    //       label:'Description',
    //       name:'description',
    //     },
    //   ],
    // },
    {
      formElements: [
        {
          type: 'file',
          name: 'db_file',
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
          value: 'Add Loki DB',
        },
      ],
    },
  ],
  // actionParams
  // hiddenFields
  asyncprops: {},
});

module.exports = {
  containers: {
    '/': {
      layout: {
        component: 'Container',
        props: {
          style: {
            padding:'1rem',
          },
        },
        children: [
          reactappLocals.server_manifest.helpers.getPageTitle({
            styles: {
              // ui: {}
            },
            title: 'Loki Databases',
            action: {
              type: 'modal',
              title: 'Add Database',
              pathname: '/add-db',
              buttonProps: {
                props: {
                  color:'isSuccess',
                },
              },
            },
          }),
          reactappLocals.server_manifest.table.getTable({
            schemaName: 'loki',
            baseUrl: '/roboloki/lokis?format=json',
            asyncdataprops: 'lowkies',
            headers: [
              {
                link: {
                  baseUrl: '/roboloki/lokis/:id',
                  params: [
                    {
                      key: ':id',
                      val:'_id',
                    },
                  ],
                },
                sortid: 'filename',
                label: 'File',
              },
            ],
            customLayoutStyle: {
              paddingBottom: '1rem',
              flexDirection: 'column',              
            },
            customLayout: {
              component: 'div',
              props: {
                style: {
                  marginBottom:'1rem'
                }
              },
              bindprops: true,
              children: [
                {
                  component: 'Message',
                  props: {
                    style: {
                      width:'100%',
                    },
                  },
                  thisprops: {
                    header: ['name', ],
                  },
                  bindprops:true,
                  children: [
                    {
                      component: 'Columns',
                      bindprops:true,
                      children: [
                        {
                          component: 'Column',
                          bindprops: true,
                          children: [
                            {
                              component: 'Content',
                              bindprops: true,
                              children: [
                                {
                                  component: 'p',
                                  bindprops: true,
                                  children: [
                                    {
                                      component: 'span',
                                      bindprops:true,
                                      thisprops: {
                                        location:['__ra_rt_link', ],
                                        children: [ 'filename', ],
                                        title: [ 'description', ],
                                      },
                                    },
                                  ],
                                },
                                
                              ],
                            },
                          ],
                          
                        },
                        reactappLocals.server_manifest.helpers.getButton({
                          action: {
                            type: 'fetch',
                            method: 'DELETE',
                            confirm: true,
                            callbackRedirect: '/',
                            pathname: '/roboloki/lokis/:id',
                            pathParams: [
                              {
                                key: ':id',
                                val:'_id',
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
                    {
                      component: 'DynamicLayout',
                      bindprops:true,                      
                      thisprops: {
                        items:['status', 'collections', ],
                      },
                      props: {
                        style: {
                          flexWrap: 'wrap',
                          // padding: '1rem 0',
                        },
                        layout: {
                          component: 'div',
                          bindprops:true,
                          children: [
                            reactappLocals.server_manifest.helpers.getButton({
                              action: {
                                type: 'link',
                                link:'/coredata/:id'
                              },
                              responsiveButton: {
                                bindprops: true,
                                thisprops: {
                                  children:['name', ],
                                },
                              },
                              props: {
                                onclickBaseUrl: '/coredata/:db/:coredata',
                                onclickLinkParams: [
                                  {
                                    key: ':coredata',
                                    val:'coredataname',
                                  },
                                  {
                                    key: ':db',
                                    val:'dbname',
                                  },
                                ],
                                style: {
                                  margin:'0.25rem',
                                },
                                buttonProps: {
                                  size: 'isSmall',
                                },
                              },
                              // content:'Remove',
                            }),
                          ],
                        },
                      },
                    },
                  ],
                },
              ],
              
              // children:'the title ehre and link',
            },
          }),
        ],
      },
      resources: {
        lowkies:'/roboloki/lokis?format=json',
      },
      pageData: {
        title:'RoboLoki',
      },
    },
    '/add-db': {
      layout: {
        component: 'div',
        children:[addDBForm, ],
      },
      resources: {},
      pageData: {
        title:'RoboLoki',
      },
    },
  },
};