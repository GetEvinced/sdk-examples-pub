package com.evinced.sampleapp.navigation.screen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.evinced.sampleapp.navigation.screen.components.verticalSpacer
import com.evinced.sampleapp.ui.theme.SampleAppTheme

@Composable
fun ImageScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        Text(
            text = "Image Screen",
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.Center,
            fontSize = 25.sp
        )

        Text("Normal icon")
        Icon(
            Icons.Filled.Favorite,
            contentDescription = "Favorite"
        )
        verticalSpacer()
        Text("Normal icon no CD")
        Icon(
            Icons.Filled.Favorite,
            contentDescription = ""
        )
        verticalSpacer()
    }
}

@Preview
@Composable
fun ImageScreenPreview() {
    SampleAppTheme {
        ImageScreen()
    }
}