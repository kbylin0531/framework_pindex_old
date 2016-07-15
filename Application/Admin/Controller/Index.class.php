<?php
/**
 * Created by PhpStorm.
 * User: lnzhv
 * Date: 7/14/16
 * Time: 4:54 PM
 */
namespace Application\Admin\Controller;
use Application\System\Library\LoginService;
use Application\System\Library\Service\CategoryService;
use Application\System\Library\Service\MenuService;
use PLite\Core\URL;
use PLite\Debugger;
use PLite\Library\Controller;
use PLite\Util\SEK;

class Index extends Controller{

    public function index(){
        $this->assign('title','后台管理系统');
        $this->display();
    }

    public function main(){
        $this->show();
    }

    public function top(){
        Debugger::closeTrace();
        $this->show();
    }

    public function left(){
        $this->assign('sidemenu',(new MenuService())->getSideMenu());
        Debugger::closeTrace();
        $this->show();
    }

    public function showForm(){
        $this->display();
    }

    public function category(){
        $list = (new CategoryService())->getCategoryList();
        $this->assign('data_list',$list);
/*
        if ($action == "add") {
            if (isset($_REQUEST['add'])) {

                $sub_catg = $_REQUEST['sub_catg'];
                $catg_name = $_REQUEST['catg_name'];
                $ps = $_REQUEST['ps'];

                if (empty($ps)) $ps = 99999;
                if (empty($catg_code)) {
                    if (strstr($sub_catg, "-")) $err = "栏目代码不合法";
                } else {
                    $split_catgs = split("-", $catg_code);
                    $split_subs = split("-", $sub_catg);
                    $cnt_catgs = count($split_catgs);
                    $cnt_subs = count($split_subs);
                    if ($cnt_subs - $cnt_catgs != 1) $err = "栏目代号不合法";
                }
                if (isset($err)) {
                    echo "<br><center><font color=#ff0000 ><b>错误：" . $err . "</b></font></center><br><br>";
                    showForm("add");
                    exit();
                }

                if (!empty($_FILES['simage']['name'])) {
                    if (!check_file_type($_FILES['simage']['tmp_name'], $_FILES['simage']['name'], $allow_pic_types)) {
                        ErrBack("图片格式错误");
                    }
                    $ext = strtolower(substr($_FILES['simage']['name'], strrpos($_FILES['simage']['name'], '.')));
                    $simage_str = md5(uniqid(microtime(), 1)) . $ext;
                    copy($_FILES['simage']['tmp_name'], $SiteImgCatg . $simage_str);
                }

                $sql = "insert into " . $dbpre . "catg (catg_code,catg_name,simage,ps) values ('$sub_catg','$catg_name','$simage_str',$ps)";
                if (@$MYSQL->query($sql)) ErrTo("子栏目 " . $catg_name . " 添加成功!", "catg_mg.php?catg_code=" . $catg_code);
                else ErrBack("出现错误！栏目未添加成功。");
            } else
                showForm("add");
        }

        if ($action == "modify") {
            if (isset($_REQUEST['modify'])) {
                $id = $_REQUEST['id'];
                $catg_name = $_REQUEST['catg_name'];
                $catg_code = $_REQUEST['catg_code'];
                $ps = $_REQUEST['ps'];

                $codearr = explode("-", $catg_code);
                $codenum = count($codearr);
                $parent_code = "";
                if ($codenum == 2) {
                    $parent_code = $codearr[0];
                } elseif ($codenum == 3) {
                    $parent_code = $codearr[0] . "-" . $codearr[1];
                } elseif ($codenum == 4) {
                    $parent_code = $codearr[0] . "-" . $codearr[1] . "-" . $codearr[2];
                }

                if (empty($ps)) $ps = 99999;
                if (empty($id)) $err = "没有指定需要修改的栏目";
                if (isset($err)) {
                    echo "<br><center><font color=#ff0000 ><b>错误：" . $err . "</b></font></center><br><br>";
                    showForm("add");
                    exit();
                }

                if (!empty($_FILES['simage']['name'])) {
                    if (!check_file_type($_FILES['simage']['tmp_name'], $_FILES['simage']['name'], $allow_pic_types)) {
                        ErrBack("图片格式错误");
                    }
                    $ext = strtolower(substr($_FILES['simage']['name'], strrpos($_FILES['simage']['name'], '.')));
                    $simage_str = md5(uniqid(microtime(), 1)) . $ext;
                    copy($_FILES['simage']['tmp_name'], $SiteImgCatg . $simage_str);

                    $img = @$MYSQL->query("select simage from " . $dbpre . "catg where id=" . $id);
                    $row = mysql_fetch_array($img);
                    if ($row["simage"])
                        @unlink($SiteImgCatg . $row["simage"]);
                }

                $where = "";
                if (!empty($simage_str)) $where .= ",simage = '" . $simage_str . "'";
                if (@$MYSQL->query("update " . $dbpre . "catg set catg_name='" . $catg_name . "',ps=" . $ps . $where . " where id=" . $id)) ErrTo("子栏目 " . $catg_name . " 修改成功!", "catg_mg.php?catg_code=" . $parent_code);
                else ErrBack("出现错误！栏目未修改成功。");
            } else
                showForm("modify");
        }

        if ($action == "remove") {
            $id = $_REQUEST['id'];
            if (empty($id)) die("未指定要删除的栏目");

            $sub = $MYSQL->query("select * from " . $dbpre . "catg where id=" . $id);
            $row_sub = mysql_fetch_array($sub);
            if (is_end($row_sub["catg_code"]) > 0) ErrBack("当前栏目下还包含子栏目！请先删除子栏目");

            if ($MYSQL->query("delete from " . $dbpre . "catg where id=" . $id)) {
                ErrBack("删除成功");
            } else {
                ErrBack("删除失败");
            }
        }
        if ($action == "delimg") {
            $id = $_REQUEST['id'];
            $img = @$MYSQL->query("select simage from " . $dbpre . "catg where id=" . $id);
            $row = mysql_fetch_array($img);
            if ($row["simage"])
                @unlink($SiteImgCatg . $row["simage"]);
            if ($MYSQL->query("update " . $dbpre . "catg set simage='' where id=" . $id))
                ErrTo("图片已删除", "catg_mg.php?action=modify&id=" . $id);
            else
                ErrBack("出现错误，图片无法删除。");
        }*/
        $this->show();
    }

    /**
     * 添加栏目
     */
    public function addCategory(){}

    /**
     * 修改栏目
     */
    public function listCategory(){}
    /**
     * 栏目列表
     */
    public function deleteCategory(){}
    /**
     * 删除栏目
     */
    public function updateCategory(){



    }



    protected function show($template=null){
        $info = LoginService::getInstance()->getLoginInfo();

        $this->assign('user_info',$info);
        //获取调用自己的函数
        null === $template and $template = SEK::backtrace(SEK::ELEMENT_FUNCTION,SEK::PLACE_FORWARD);
        $this->display($template /* substr($template,4) 第五个字符开始 */);
    }







}