package com.evinced.sampleapp.navigation.screen

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType
import androidx.compose.ui.unit.sp
import com.evinced.sampleapp.navigation.screen.components.verticalSpacer
import com.evinced.sampleapp.ui.theme.SampleAppTheme

@Composable
fun TextScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        Text(
            text = "Text Screen",
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.Center,
            fontSize = 25.sp
        )
        verticalSpacer()
        Text("Example default text. The quick brown fox jumps over the lazy dog.")
        verticalSpacer()
        Text(
            text = "Example fixed text. The quick brown fox jumps over the lazy dog.",
            fontSize = TextUnit(3.5F, TextUnitType.Em)
        )
        verticalSpacer()
        Text(
            text = "Example overly light text. The quick brown fox jumps over the lazy dog.",
            color = Color.White
        )
        verticalSpacer()
        Text(
            text = "Example overly dark text. The quick brown fox jumps over the lazy dog.",
            color = Color.Black
        )
        verticalSpacer()
        Text(
            text = "Example wrong theme text. The quick brown fox jumps over the lazy dog.",
            color = MaterialTheme.colorScheme.background
        )
    }
}

@Preview
@Composable
fun TextScreenPreview() {
    SampleAppTheme {
        TextScreen()
    }
}