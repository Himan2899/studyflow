import streamlit as st
import pandas as pd
import plotly.express as px
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

# Page config
st.set_page_config(
    page_title="StudyFlow",
    page_icon="📚",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stButton>button {
        width: 100%;
    }
    </style>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.title("StudyFlow 📚")
    st.markdown("---")
    
    # Navigation
    page = st.radio(
        "Navigation",
        ["Dashboard", "Tasks", "Resources", "Progress"]
    )

# Main content
if page == "Dashboard":
    st.title("Dashboard")
    
    # Create three columns for metrics
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(label="Total Tasks", value="12", delta="2")
    
    with col2:
        st.metric(label="Completed", value="8", delta="3")
    
    with col3:
        st.metric(label="In Progress", value="4", delta="-1")
    
    # Sample chart
    chart_data = pd.DataFrame({
        "Date": pd.date_range(start="2024-01-01", periods=10),
        "Progress": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    })
    
    fig = px.line(chart_data, x="Date", y="Progress", title="Study Progress")
    st.plotly_chart(fig, use_container_width=True)

elif page == "Tasks":
    st.title("Tasks")
    
    # Task input
    with st.form("task_form"):
        task_name = st.text_input("Task Name")
        task_description = st.text_area("Description")
        task_due_date = st.date_input("Due Date")
        task_priority = st.selectbox("Priority", ["High", "Medium", "Low"])
        
        submitted = st.form_submit_button("Add Task")
        if submitted:
            # Add task to Supabase
            try:
                data = {
                    "name": task_name,
                    "description": task_description,
                    "due_date": str(task_due_date),
                    "priority": task_priority,
                    "status": "pending"
                }
                supabase.table("tasks").insert(data).execute()
                st.success("Task added successfully!")
            except Exception as e:
                st.error(f"Error adding task: {str(e)}")

elif page == "Resources":
    st.title("Study Resources")
    
    # Resource upload
    uploaded_file = st.file_uploader("Upload Study Material", type=["pdf", "docx", "txt"])
    if uploaded_file is not None:
        st.success("File uploaded successfully!")
    
    # Resource list
    st.subheader("Your Resources")
    # Add resource list display logic here

elif page == "Progress":
    st.title("Progress Tracking")
    
    # Progress metrics
    st.subheader("Overall Progress")
    progress = st.slider("Current Progress", 0, 100, 75)
    st.progress(progress / 100)
    
    # Study time tracking
    st.subheader("Study Time")
    study_hours = st.number_input("Hours Studied Today", min_value=0, max_value=24, value=2)
    st.write(f"Total study time this week: {study_hours * 7} hours")

# Footer
st.markdown("---")
st.markdown("Developed with ❤️ by Himanshu Bali 💻👨‍💻🚀") 