from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from datetime import datetime, timezone, timedelta
from app.models import Application

bp = Blueprint('dashboard', __name__)

@bp.route("/api/dashboard", methods=["GET"])
@login_required
def api_dashboard():
    # Calculate 6 months data
    six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
    apps_last_6_months = Application.query.filter(
        Application.user_id == current_user.id, Application.created_at >= six_months_ago
    ).count()

    # Growth calculation (last 3 months vs prior 3 months)
    three_months_ago = datetime.now(timezone.utc) - timedelta(days=90)
    apps_last_3 = Application.query.filter(
        Application.user_id == current_user.id,
        Application.created_at >= three_months_ago,
    ).count()
    apps_prev_3 = apps_last_6_months - apps_last_3
    growth = 0
    if apps_prev_3 > 0:
        growth = round(((apps_last_3 - apps_prev_3) / apps_prev_3) * 100, 1)

    # Monthly data for the last 6 months
    monthly_data = {}
    monthly_counts = []
    current_date = datetime.now(timezone.utc)

    for i in range(6):
        # Calculate the start and end of each month
        if i == 0:
            # Current month
            month_start = current_date.replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            month_end = current_date
        else:
            # Previous months
            month_date = current_date.replace(day=1) - timedelta(
                days=i * 30
            )  # Approximate
            month_start = month_date.replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            # Get last day of the month
            if month_date.month == 12:
                next_month = month_date.replace(year=month_date.year + 1, month=1)
            else:
                next_month = month_date.replace(month=month_date.month + 1)
            month_end = next_month - timedelta(days=1)
            month_end = month_end.replace(hour=23, minute=59, second=59)

        count = Application.query.filter(
            Application.user_id == current_user.id,
            Application.created_at >= month_start,
            Application.created_at <= month_end,
        ).count()

        month_name = month_start.strftime("%b")
        monthly_data[month_name] = count
        monthly_counts.append(count)

    # Reverse to show oldest to newest
    monthly_data = dict(reversed(list(monthly_data.items())))
    
    # Status counts
    status_counts = {
        "applied": Application.query.filter_by(
            user_id=current_user.id, status="applied"
        ).count(),
        "interview": Application.query.filter_by(
            user_id=current_user.id, status="interview"
        ).count(),
        "offer": Application.query.filter_by(
            user_id=current_user.id, status="offer"
        ).count(),
        "rejected": Application.query.filter_by(
            user_id=current_user.id, status="rejected"
        ).count(),
    }
    
    # Recent Applications
    recent_apps = (
        Application.query.filter_by(user_id=current_user.id)
        .order_by(Application.updated_at.desc())
        .limit(5)
        .all()
    )
    
    recent_apps_data = []
    for app in recent_apps:
        recent_apps_data.append({
            "id": app.app_id,
            "job_title": app.job_title,
            "company": app.company,
            "status": app.status,
            "date": app.updated_at.strftime("%Y-%m-%d")
        })

    return jsonify({
        "user": {
            "username": current_user.username,
            "email": current_user.email,
            "verified": current_user.verified
        },
        "stats": {
            "total_6_months": apps_last_6_months,
            "growth": growth,
            "status_counts": status_counts,
            "monthly_data": monthly_data
        },
        "recent_applications": recent_apps_data
    })
