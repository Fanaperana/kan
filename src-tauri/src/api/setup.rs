use tauri::{AppHandle, RunEvent, Runtime};

pub fn on_run<R: Runtime>(_app: &AppHandle<R>, _event: RunEvent) {
    match _event {
        tauri::RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        _ => {}
    }
}

