import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useHistory } from "react-router-dom";

import Dropdown from "../Dropdown";
import { OktaStateType, OktaUserData } from "../../types/oktaTypes";
import { ITEMS } from "../../constants/routerConstants";

import styles from "./styles.module.scss";

const LOGOUT = "Logout";
const ITEMS_LABEL = "Items";

const UserActions = (): JSX.Element | null => {
  const [user, setUser] = useState<OktaUserData | null>();
  const { push } = useHistory();
  const { authService, authState }: OktaStateType = useOktaAuth();

  useEffect(() => {
    if (authState.isAuthenticated) {
      authService.getUser().then((userData: OktaUserData) => {
        setUser(userData);
      });
    } else {
      setUser(null);
    }
  }, [authState, authService]);

  let el = null;

  if (user) {
    const SELECT_OPTIONS = [
      {
        action: () => {
          push(ITEMS);
        },
        label: ITEMS_LABEL,
      },
      {
        action: () => {
          authService.logout();
        },
        label: LOGOUT,
      },
    ];

    el = (
      <div className={styles.userActions}>
        <div className={styles.avatar}>{user.name.trim().charAt(0)}</div>
        <Dropdown options={SELECT_OPTIONS} labelText={user.name} />
      </div>
    );
  }

  return el;
};

export default UserActions;
