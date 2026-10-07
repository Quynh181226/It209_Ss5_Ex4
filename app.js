// Phien ban he thong v1.0.1 (Hotfix)
function getUser(user) {
    // DA SUA LOI: Khong tra ve password nguoi dung
    return {
        id: user.id,
        username: user.username
    };
}

module.exports = { getUser };
