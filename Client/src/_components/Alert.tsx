import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { alertService, AlertType } from '../_services';
import { history } from '../_helpers';

const propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool
};

const defaultProps = {
  fade: true,
  id: 'default-alert'
};

function Alert({ id, fade }: { id: string; fade: string }) {
  const [alerts, setAlerts] = useState<string[]>([]);

  function removeAlert(alert: any) {
    if (fade) {
      // fade out alert
      const alertWithFade = { ...alert, fade: true };
      setAlerts((alerts: any) => alerts.map((x: any) => (x === alert ? alertWithFade : x)));

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert));
    }
  }

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x: any) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          filteredAlerts.forEach((x: any) => delete x.keepAfterRouteChange);
          return filteredAlerts;
        });
      } else {
        // add alert to array
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const historyUnlisten = history.listen(({ pathname }) => {
      // don't clear if pathname has trailing slash because this will be auto redirected again
      if (pathname.endsWith('/')) return;

      alertService.clear(id);
    });

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe & unlisten to avoid memory leaks
      subscription.unsubscribe();
      historyUnlisten();
    };
  }, []);

  function cssClasses(alert: any): string {
    if (!alert) return '';

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }

  if (!alerts.length) return null;

  return (
    <div className="container">
      <div className="m-3">
        {alerts.map((alert: any, index) => (
          <div key={index} className={cssClasses(alert)}>
            <a className="close" onClick={() => removeAlert(alert)} role="button" tabIndex={0}>
              &times;
            </a>
            <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
          </div>
        ))}
      </div>
    </div>
  );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export { Alert };
