import React, { useEffect, useState } from "react";

import { Navigate, useRoutes } from "react-router-dom";

import HomeScreen from "./pages/HomeScreen"

export default function Router(props) {
    
    const routes = useRoutes([
        { path: "/", element: <Navigate to="/home" replace /> },
        {
            path: "home",
            element: (
                <HomeScreen />
                )
            }
        ]);
        
        return routes;
    }
    