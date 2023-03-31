// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;

fn main() {
    tauri::Builder::default()
        .system_tray(api::tray::menu_tray())
        .on_system_tray_event(api::tray::menu_tray_event)
        // .invoke_handler(tauri::generate_handler![])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(api::setup::on_run)
}
