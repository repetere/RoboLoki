'use strict';
// const styles = CONSTANTS.styles;

module.exports = {  
  'layout': {
    'component': 'Section',
    'props': {
      style: {
        // backgroundColor: styles.application.background,
        height: '100%',
      },
    },
      // "asyncprops": {
      //   "healthcheck": ["healthcheckStatus"]
      // },
    'children': [
      {
        'component': 'Container',
        'props': {
          'hasTextCentered': true,
          'style': {
            marginTop: 120,
            marginBottom: 120,
            paddingLeft: '15%',
            paddingRight: '15%',
          },
        },
        'children':[{
          'component': 'div',
          'props': {},
          'children': [{
            'component': 'Title',
            'props': {
              'size': 'is2',
              'style': {
                'fontWeight': 'normal',
                // 'color': styles.colors.darkGreyText,
              },
            },
            'children': '404 Error',
          },
          {  
            'component': 'hr',
            'props': {
              'style': {
                'opacity': '0.25',
                'margin': '1.5rem 0',
              },
            },
          },
          {
            'component': 'Subtitle',
            'props': {
              'size': 'is4',
              'style': {
                'margin': '1.5rem 0',
                'fontWeight': 'normal',
                // 'color': styles.colors.darkGreyText,
              },
            },
            'children': 'The page cannot be found',
          },
          {
            'component': 'Subtitle',
            'props': {
              'size': 'is5',
              'style': {
                'lineHeight': '1.5',
                'fontWeight': 'normal',
                // 'color': styles.colors.darkGreyText,
              },
            },
            children: 'Could not find resource.',
          },
          {
            component: 'ResponsiveButton',
            props: {
              onClick: 'func:this.props.reduxRouter.goBack',
              onclickProps: '/',
              style: {
                marginTop: 40,
              },
              buttonProps: {
                size: 'isLarge',
                className: 'error404',
                color: 'isPrimary',
              },
              passProps: {
                className: '',
              },
            },
            children: 'Go Back',
          },
          // {
          //   'component': 'RawOutput',
          //   'props': {
          //     'select': 'locationdata',  
          //     'type': 'block',
          //     'display': true,
          //   },  
          //   'windowprops': {
          //     'locationdata':['location', 'href',],
          //   },  
          // },
          
          ],
        }, ],
      }, ],
  },
  'resources': {
    // "healthcheckStatus":"/r-admin/load/healthcheck",
  },
  callbacks: [],
  'onFinish':'render',
  'pageData':{
    'title':'Page Not Found',
    'navLabel':'Error Page Not Found',
  },
};