#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri::api::dialog::*; // Add tihs

#[tauri::command]
fn search(ingredient: &str) {
    println!("ingredient list: {ingredient}");
}

#[tauri::command]
fn error() {
    println!("Error has occurred");
}

// creates an alert window
#[tauri::command]
fn display(window: tauri::Window) {
    println!("Test");
    let label = window.label();
    let parent = window.get_window(label).unwrap();
    tauri::async_runtime::spawn(async move {
        message(Some(&parent), "Title", "pls work");
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![search, error, display])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
