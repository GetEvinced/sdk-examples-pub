import SwiftUI

struct ContentView: View {
    @State private var showDetail = false

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Evinced XCUI Examples")
                    .font(.title)

                Button("Primary Action") {}
                    .accessibilityLabel("Primary Action")

                Button("Show Detail") { showDetail = true }
                    .accessibilityLabel("Show Detail")

                if showDetail {
                    Text("Detail screen content")
                        .accessibilityLabel("Detail screen content")
                }
            }
            .padding()
            .navigationTitle("Evinced Examples")
        }
    }
}
