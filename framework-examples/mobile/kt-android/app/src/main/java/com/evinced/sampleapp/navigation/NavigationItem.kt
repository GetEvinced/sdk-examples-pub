package com.evinced.sampleapp.navigation

import android.annotation.SuppressLint
import androidx.annotation.DrawableRes
import androidx.annotation.IntegerRes
import com.evinced.sampleapp.R

@SuppressLint("ResourceType")
sealed class NavigationItem(var route: String, @DrawableRes var icon: Int, @IntegerRes var title: Int) {
    data object Text : NavigationItem("text", android.R.drawable.ic_menu_edit, R.string.nav_text)
    data object Image : NavigationItem("image", android.R.drawable.ic_menu_gallery, R.string.nav_image)
    data object Button : NavigationItem("button", android.R.drawable.ic_menu_add, R.string.nav_button)

    val bottomNavBarOptions: List<NavigationItem> by lazy {
        listOf(
            Text, Image, Button
        )
    }
}