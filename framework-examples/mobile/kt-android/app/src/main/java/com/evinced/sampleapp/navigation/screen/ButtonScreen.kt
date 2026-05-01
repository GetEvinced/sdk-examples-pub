package com.evinced.sampleapp.navigation.screen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
fun ButtonScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        Text(
            text = "Button Screen",
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.Center,
            fontSize = 25.sp
        )

        Button(onClick = {}) {
            Text("Normal button")
        }
        verticalSpacer()
        Text("Icon Button")
        IconButton(onClick = {}) {
            Icon(
                Icons.Filled.Call,
                contentDescription = "Call"
            )
        }
        verticalSpacer()
        Text("Bad Icon Button")
        Button(onClick = {}) {
            Icon(
                Icons.Filled.Call,
                contentDescription = "Call"
            )
        }
    }
}

@Preview
@Composable
fun ButtonScreenPreview() {
    SampleAppTheme {
        ButtonScreen()
    }
}