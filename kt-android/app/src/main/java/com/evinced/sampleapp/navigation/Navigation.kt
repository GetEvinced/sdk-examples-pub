package com.evinced.sampleapp.navigation

import androidx.compose.runtime.Composable

import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.evinced.sampleapp.navigation.screen.ButtonScreen
import com.evinced.sampleapp.navigation.screen.ImageScreen
import com.evinced.sampleapp.navigation.screen.TextScreen

@Composable
fun Navigation(navController: NavHostController) {
    NavHost(navController, startDestination = NavigationItem.Text.route) {
        composable(NavigationItem.Text.route) {
            TextScreen()
        }
        composable(NavigationItem.Image.route) {
            ImageScreen()
        }
        composable(NavigationItem.Button.route) {
            ButtonScreen()
        }
    }
}