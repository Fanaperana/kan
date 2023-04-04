use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, PhysicalSize, Runtime, Size, Window, WindowBuilder, WindowUrl,
};

// the plugin custom command handlers if you choose to extend the API:

#[tauri::command]
async fn create_help_win<R: Runtime>(_app: AppHandle<R>, win: Window<R>) {
    match win.get_window("help_win") {
        Some(window) => {
            match window.show() {
                Ok(_) => {
                    window_style(&window);
                }
                Err(_) => {
                    println!("Error");
                }
            };
        }
        None => {
            WindowBuilder::new(
                &_app,
                "help_win", /* the unique window label */
                WindowUrl::App("help.html".into()),
            )
            .center()
            .inner_size(400.0, 600.0)
            .max_inner_size(400.0, 600.0)
            .resizable(true)
            .title("kan")
            .decorations(false)
            .visible(true)
            .always_on_top(true)
            .build()
            .unwrap();
        }
    }
}

fn window_style<R: Runtime>(_win: &Window<R>) {
    let max_size = PhysicalSize::new(300, 400);

    _win.set_max_size(Size::new(max_size).into()).unwrap();
    _win.set_min_size(Size::new(max_size).into()).unwrap();
    _win.set_size(Size::new(max_size)).unwrap();
    _win.center().unwrap();
    _win.set_focus().unwrap();
    _win.set_fullscreen(false).unwrap();
    _win.set_resizable(false).unwrap();
    _win.set_title("Kan Help").unwrap();
    _win.set_decorations(false).unwrap();
    _win.set_always_on_top(true).unwrap();
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("win")
        .invoke_handler(tauri::generate_handler![create_help_win])
        .build()
}
