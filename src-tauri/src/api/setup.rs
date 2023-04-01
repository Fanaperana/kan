use tauri::{AppHandle, GlobalWindowEvent, RunEvent, Runtime};

#[allow(unused)]
pub fn on_run<R: Runtime>(_app: &AppHandle<R>, _event: RunEvent) {
    match _event {
        tauri::RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        _ => {}
    }
}

pub fn win_event<R: Runtime>(_event: GlobalWindowEvent<R>) {
    match _event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            _event.window().hide().unwrap();
            api.prevent_close();
        }
        _ => {}
    }
}
